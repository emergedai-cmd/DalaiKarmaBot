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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
function pickAnthropicEnv() {
    var _a, _b;
    var oauth = (_a = process.env.ANTHROPIC_OAUTH_TOKEN) === null || _a === void 0 ? void 0 : _a.trim();
    if (oauth) {
        return { type: "oauth", value: oauth };
    }
    var api = (_b = process.env.ANTHROPIC_API_KEY) === null || _b === void 0 ? void 0 : _b.trim();
    if (api) {
        return { type: "api", value: api };
    }
    return null;
}
function pickZaiKey() {
    var _a, _b, _c, _d;
    return (_d = (_b = (_a = process.env.ZAI_API_KEY) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : (_c = process.env.Z_AI_API_KEY) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : null;
}
function runCommand(label, args, env) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var child = (0, node_child_process_1.spawn)("pnpm", args, {
                            env: env,
                            stdio: ["ignore", "pipe", "pipe"],
                        });
                        var stdout = "";
                        var stderr = "";
                        child.stdout.on("data", function (chunk) {
                            var text = String(chunk);
                            stdout += text;
                            process.stdout.write(text);
                        });
                        child.stderr.on("data", function (chunk) {
                            var text = String(chunk);
                            stderr += text;
                            process.stderr.write(text);
                        });
                        child.on("error", function (err) { return reject(err); });
                        child.on("close", function (code, signal) {
                            if (code === 0) {
                                resolve({ code: code, signal: signal, stdout: stdout, stderr: stderr });
                                return;
                            }
                            resolve({ code: code, signal: signal, stdout: stdout, stderr: stderr });
                            var summary = signal
                                ? "".concat(label, " exited with signal ").concat(signal)
                                : "".concat(label, " exited with code ").concat(code);
                            console.error(summary);
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var anthropic, zaiKey, baseDir, stateDir, configPath, config, sessionId, baseEnv, envValidAnthropic, envInvalidAnthropic, toolPrompt, run1, sessionFile, transcript, followupPrompt, run2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    anthropic = pickAnthropicEnv();
                    zaiKey = pickZaiKey();
                    if (!anthropic) {
                        console.error("Missing ANTHROPIC_OAUTH_TOKEN or ANTHROPIC_API_KEY.");
                        process.exit(1);
                    }
                    if (!zaiKey) {
                        console.error("Missing ZAI_API_KEY or Z_AI_API_KEY.");
                        process.exit(1);
                    }
                    return [4 /*yield*/, promises_1.default.mkdtemp(node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-zai-fallback-"))];
                case 1:
                    baseDir = _e.sent();
                    stateDir = node_path_1.default.join(baseDir, "state");
                    configPath = node_path_1.default.join(baseDir, "openclaw.json");
                    return [4 /*yield*/, promises_1.default.mkdir(stateDir, { recursive: true })];
                case 2:
                    _e.sent();
                    config = {
                        agents: {
                            defaults: {
                                model: {
                                    primary: "anthropic/claude-opus-4-5",
                                    fallbacks: ["zai/glm-4.7"],
                                },
                                models: {
                                    "anthropic/claude-opus-4-5": {},
                                    "zai/glm-4.7": {},
                                },
                            },
                        },
                    };
                    return [4 /*yield*/, promises_1.default.writeFile(configPath, JSON.stringify(config, null, 2), "utf8")];
                case 3:
                    _e.sent();
                    sessionId = (_b = (_a = process.env.OPENCLAW_ZAI_FALLBACK_SESSION_ID) !== null && _a !== void 0 ? _a : process.env.CLAWDBOT_ZAI_FALLBACK_SESSION_ID) !== null && _b !== void 0 ? _b : (0, node_crypto_1.randomUUID)();
                    baseEnv = __assign(__assign({}, process.env), { OPENCLAW_CONFIG_PATH: configPath, OPENCLAW_STATE_DIR: stateDir, CLAWDBOT_CONFIG_PATH: configPath, CLAWDBOT_STATE_DIR: stateDir, ZAI_API_KEY: zaiKey, Z_AI_API_KEY: "" });
                    envValidAnthropic = __assign(__assign({}, baseEnv), { ANTHROPIC_OAUTH_TOKEN: anthropic.type === "oauth" ? anthropic.value : "", ANTHROPIC_API_KEY: anthropic.type === "api" ? anthropic.value : "" });
                    envInvalidAnthropic = __assign(__assign({}, baseEnv), { ANTHROPIC_OAUTH_TOKEN: anthropic.type === "oauth" ? "invalid" : "", ANTHROPIC_API_KEY: anthropic.type === "api" ? "invalid" : "" });
                    console.log("== Run 1: create tool history (primary only)");
                    toolPrompt = "Use the exec tool to create a file named zai-fallback-tool.txt with the content tool-ok. " +
                        "Then use the read tool to display the file contents. Reply with just the file contents.";
                    return [4 /*yield*/, runCommand("run1", ["openclaw", "agent", "--local", "--session-id", sessionId, "--message", toolPrompt], envValidAnthropic)];
                case 4:
                    run1 = _e.sent();
                    if (run1.code !== 0) {
                        process.exit((_c = run1.code) !== null && _c !== void 0 ? _c : 1);
                    }
                    sessionFile = node_path_1.default.join(stateDir, "agents", "main", "sessions", "".concat(sessionId, ".jsonl"));
                    return [4 /*yield*/, promises_1.default.readFile(sessionFile, "utf8").catch(function () { return ""; })];
                case 5:
                    transcript = _e.sent();
                    if (!transcript.includes('"toolResult"')) {
                        console.warn("Warning: no toolResult entries detected in session history.");
                    }
                    console.log("== Run 2: force auth failover to Z.AI");
                    followupPrompt = "What is the content of zai-fallback-tool.txt? Reply with just the contents.";
                    return [4 /*yield*/, runCommand("run2", ["openclaw", "agent", "--local", "--session-id", sessionId, "--message", followupPrompt], envInvalidAnthropic)];
                case 6:
                    run2 = _e.sent();
                    if (run2.code === 0) {
                        console.log("PASS: fallback succeeded.");
                        process.exit(0);
                    }
                    console.error("FAIL: fallback failed.");
                    process.exit((_d = run2.code) !== null && _d !== void 0 ? _d : 1);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
