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
var service_audit_js_1 = require("./service-audit.js");
var service_env_js_1 = require("./service-env.js");
(0, vitest_1.describe)("auditGatewayServiceConfig", function () {
    (0, vitest_1.it)("flags bun runtime", function () { return __awaiter(void 0, void 0, void 0, function () {
        var audit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, service_audit_js_1.auditGatewayServiceConfig)({
                        env: { HOME: "/tmp" },
                        platform: "darwin",
                        command: {
                            programArguments: ["/opt/homebrew/bin/bun", "gateway"],
                            environment: { PATH: "/usr/bin:/bin" },
                        },
                    })];
                case 1:
                    audit = _a.sent();
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayRuntimeBun; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("flags version-managed node paths", function () { return __awaiter(void 0, void 0, void 0, function () {
        var audit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, service_audit_js_1.auditGatewayServiceConfig)({
                        env: { HOME: "/tmp" },
                        platform: "darwin",
                        command: {
                            programArguments: ["/Users/test/.nvm/versions/node/v22.0.0/bin/node", "gateway"],
                            environment: {
                                PATH: "/usr/bin:/bin:/Users/test/.nvm/versions/node/v22.0.0/bin",
                            },
                        },
                    })];
                case 1:
                    audit = _a.sent();
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager; })).toBe(true);
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayPathNonMinimal; })).toBe(true);
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayPathMissingDirs; })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts Linux minimal PATH with user directories", function () { return __awaiter(void 0, void 0, void 0, function () {
        var env, minimalPath, audit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    env = { HOME: "/home/testuser", PNPM_HOME: "/opt/pnpm" };
                    minimalPath = (0, service_env_js_1.buildMinimalServicePath)({ platform: "linux", env: env });
                    return [4 /*yield*/, (0, service_audit_js_1.auditGatewayServiceConfig)({
                            env: env,
                            platform: "linux",
                            command: {
                                programArguments: ["/usr/bin/node", "gateway"],
                                environment: { PATH: minimalPath },
                            },
                        })];
                case 1:
                    audit = _a.sent();
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayPathNonMinimal; })).toBe(false);
                    (0, vitest_1.expect)(audit.issues.some(function (issue) { return issue.code === service_audit_js_1.SERVICE_AUDIT_CODES.gatewayPathMissingDirs; })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
