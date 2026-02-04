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
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var temp_home_js_1 = require("../../test/helpers/temp-home.js");
var sandboxMocks = vitest_1.vi.hoisted(function () { return ({
    ensureSandboxWorkspaceForSession: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock("../agents/sandbox.js", function () { return sandboxMocks; });
var sandbox_js_1 = require("../agents/sandbox.js");
var stage_sandbox_media_js_1 = require("./reply/stage-sandbox-media.js");
function withTempHome(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, temp_home_js_1.withTempHome)(function (home) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fn(home)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); }, { prefix: "openclaw-triggers-bypass-" })];
        });
    });
}
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)("stageSandboxMedia security", function () {
    (0, vitest_1.it)("rejects staging host files from outside the media directory", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withTempHome(function (home) { return __awaiter(void 0, void 0, void 0, function () {
                        var sensitiveFile, sandboxDir, ctx, sessionCtx, stagedFullPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    sensitiveFile = (0, node_path_1.join)(home, "secrets.txt");
                                    return [4 /*yield*/, promises_1.default.writeFile(sensitiveFile, "SENSITIVE DATA")];
                                case 1:
                                    _a.sent();
                                    sandboxDir = (0, node_path_1.join)(home, "sandboxes", "session");
                                    vitest_1.vi.mocked(sandbox_js_1.ensureSandboxWorkspaceForSession).mockResolvedValue({
                                        workspaceDir: sandboxDir,
                                        containerWorkdir: "/work",
                                    });
                                    ctx = {
                                        Body: "hi",
                                        From: "whatsapp:group:demo",
                                        To: "+2000",
                                        ChatType: "group",
                                        Provider: "whatsapp",
                                        MediaPath: sensitiveFile,
                                        MediaType: "image/jpeg",
                                        MediaUrl: sensitiveFile,
                                    };
                                    sessionCtx = __assign({}, ctx);
                                    // This should fail or skip the file
                                    return [4 /*yield*/, (0, stage_sandbox_media_js_1.stageSandboxMedia)({
                                            ctx: ctx,
                                            sessionCtx: sessionCtx,
                                            cfg: {
                                                agents: {
                                                    defaults: {
                                                        model: "anthropic/claude-opus-4-5",
                                                        workspace: (0, node_path_1.join)(home, "openclaw"),
                                                        sandbox: {
                                                            mode: "non-main",
                                                            workspaceRoot: (0, node_path_1.join)(home, "sandboxes"),
                                                        },
                                                    },
                                                },
                                                channels: { whatsapp: { allowFrom: ["*"] } },
                                                session: { store: (0, node_path_1.join)(home, "sessions.json") },
                                            },
                                            sessionKey: "agent:main:main",
                                            workspaceDir: (0, node_path_1.join)(home, "openclaw"),
                                        })];
                                case 2:
                                    // This should fail or skip the file
                                    _a.sent();
                                    stagedFullPath = (0, node_path_1.join)(sandboxDir, "media", "inbound", (0, node_path_1.basename)(sensitiveFile));
                                    // Expect the file NOT to be staged
                                    return [4 /*yield*/, (0, vitest_1.expect)(promises_1.default.stat(stagedFullPath)).rejects.toThrow()];
                                case 3:
                                    // Expect the file NOT to be staged
                                    _a.sent();
                                    // Context should NOT be rewritten to a sandbox path if it failed to stage
                                    (0, vitest_1.expect)(ctx.MediaPath).toBe(sensitiveFile);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
