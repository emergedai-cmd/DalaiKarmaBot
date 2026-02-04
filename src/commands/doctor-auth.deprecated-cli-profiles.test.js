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
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var doctor_auth_js_1 = require("./doctor-auth.js");
var originalAgentDir;
var originalPiAgentDir;
var tempAgentDir;
function makePrompter(confirmValue) {
    return {
        confirm: vitest_1.vi.fn().mockResolvedValue(confirmValue),
        confirmRepair: vitest_1.vi.fn().mockResolvedValue(confirmValue),
        confirmAggressive: vitest_1.vi.fn().mockResolvedValue(confirmValue),
        confirmSkipInNonInteractive: vitest_1.vi.fn().mockResolvedValue(confirmValue),
        select: vitest_1.vi.fn().mockResolvedValue(""),
        shouldRepair: confirmValue,
        shouldForce: false,
    };
}
(0, vitest_1.beforeEach)(function () {
    originalAgentDir = process.env.OPENCLAW_AGENT_DIR;
    originalPiAgentDir = process.env.PI_CODING_AGENT_DIR;
    tempAgentDir = node_fs_1.default.mkdtempSync(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-auth-"));
    process.env.OPENCLAW_AGENT_DIR = tempAgentDir;
    process.env.PI_CODING_AGENT_DIR = tempAgentDir;
});
(0, vitest_1.afterEach)(function () {
    if (originalAgentDir === undefined) {
        delete process.env.OPENCLAW_AGENT_DIR;
    }
    else {
        process.env.OPENCLAW_AGENT_DIR = originalAgentDir;
    }
    if (originalPiAgentDir === undefined) {
        delete process.env.PI_CODING_AGENT_DIR;
    }
    else {
        process.env.PI_CODING_AGENT_DIR = originalPiAgentDir;
    }
    if (tempAgentDir) {
        node_fs_1.default.rmSync(tempAgentDir, { recursive: true, force: true });
        tempAgentDir = undefined;
    }
});
(0, vitest_1.describe)("maybeRemoveDeprecatedCliAuthProfiles", function () {
    (0, vitest_1.it)("removes deprecated CLI auth profiles from store + config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authPath, cfg, next, raw;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!tempAgentDir) {
                        throw new Error("Missing temp agent dir");
                    }
                    authPath = node_path_1.default.join(tempAgentDir, "auth-profiles.json");
                    node_fs_1.default.writeFileSync(authPath, "".concat(JSON.stringify({
                        version: 1,
                        profiles: {
                            "anthropic:claude-cli": {
                                type: "oauth",
                                provider: "anthropic",
                                access: "token-a",
                                refresh: "token-r",
                                expires: Date.now() + 60000,
                            },
                            "openai-codex:codex-cli": {
                                type: "oauth",
                                provider: "openai-codex",
                                access: "token-b",
                                refresh: "token-r2",
                                expires: Date.now() + 60000,
                            },
                        },
                    }, null, 2), "\n"), "utf8");
                    cfg = {
                        auth: {
                            profiles: {
                                "anthropic:claude-cli": { provider: "anthropic", mode: "oauth" },
                                "openai-codex:codex-cli": { provider: "openai-codex", mode: "oauth" },
                            },
                            order: {
                                anthropic: ["anthropic:claude-cli"],
                                "openai-codex": ["openai-codex:codex-cli"],
                            },
                        },
                    };
                    return [4 /*yield*/, (0, doctor_auth_js_1.maybeRemoveDeprecatedCliAuthProfiles)(cfg, makePrompter(true))];
                case 1:
                    next = _l.sent();
                    raw = JSON.parse(node_fs_1.default.readFileSync(authPath, "utf8"));
                    (0, vitest_1.expect)((_a = raw.profiles) === null || _a === void 0 ? void 0 : _a["anthropic:claude-cli"]).toBeUndefined();
                    (0, vitest_1.expect)((_b = raw.profiles) === null || _b === void 0 ? void 0 : _b["openai-codex:codex-cli"]).toBeUndefined();
                    (0, vitest_1.expect)((_d = (_c = next.auth) === null || _c === void 0 ? void 0 : _c.profiles) === null || _d === void 0 ? void 0 : _d["anthropic:claude-cli"]).toBeUndefined();
                    (0, vitest_1.expect)((_f = (_e = next.auth) === null || _e === void 0 ? void 0 : _e.profiles) === null || _f === void 0 ? void 0 : _f["openai-codex:codex-cli"]).toBeUndefined();
                    (0, vitest_1.expect)((_h = (_g = next.auth) === null || _g === void 0 ? void 0 : _g.order) === null || _h === void 0 ? void 0 : _h.anthropic).toBeUndefined();
                    (0, vitest_1.expect)((_k = (_j = next.auth) === null || _j === void 0 ? void 0 : _j.order) === null || _k === void 0 ? void 0 : _k["openai-codex"]).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
