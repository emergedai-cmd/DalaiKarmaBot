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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var vitest_1 = require("vitest");
var repoRoot = (0, node_path_1.resolve)((0, node_url_1.fileURLToPath)(new URL(".", import.meta.url)), "..");
function writeDockerStub(binDir, logPath) {
    return __awaiter(this, void 0, void 0, function () {
        var stub;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stub = "#!/usr/bin/env bash\nset -euo pipefail\nlog=\"$DOCKER_STUB_LOG\"\nif [[ \"${1:-}\" == \"compose\" && \"${2:-}\" == \"version\" ]]; then\n  exit 0\nfi\nif [[ \"${1:-}\" == \"build\" ]]; then\n  echo \"build $*\" >>\"$log\"\n  exit 0\nfi\nif [[ \"${1:-}\" == \"compose\" ]]; then\n  echo \"compose $*\" >>\"$log\"\n  exit 0\nfi\necho \"unknown $*\" >>\"$log\"\nexit 0\n";
                    return [4 /*yield*/, (0, promises_1.mkdir)(binDir, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(binDir, "docker"), stub, { mode: 493 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(logPath, "")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vitest_1.describe)("docker-setup.sh", function () {
    (0, vitest_1.it)("handles unset optional env vars under strict mode", function () { return __awaiter(void 0, void 0, void 0, function () {
        var assocCheck, rootDir, scriptPath, dockerfilePath, composePath, binDir, logPath, script, env, result, envFile;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    assocCheck = (0, node_child_process_1.spawnSync)("bash", ["-c", "declare -A _t=()"], {
                        encoding: "utf8",
                    });
                    if (assocCheck.status !== 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "openclaw-docker-setup-"))];
                case 1:
                    rootDir = _b.sent();
                    scriptPath = (0, node_path_1.join)(rootDir, "docker-setup.sh");
                    dockerfilePath = (0, node_path_1.join)(rootDir, "Dockerfile");
                    composePath = (0, node_path_1.join)(rootDir, "docker-compose.yml");
                    binDir = (0, node_path_1.join)(rootDir, "bin");
                    logPath = (0, node_path_1.join)(rootDir, "docker-stub.log");
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repoRoot, "docker-setup.sh"), "utf8")];
                case 2:
                    script = _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(scriptPath, script, { mode: 493 })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(dockerfilePath, "FROM scratch\n")];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(composePath, "services:\n  openclaw-gateway:\n    image: noop\n  openclaw-cli:\n    image: noop\n")];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, writeDockerStub(binDir, logPath)];
                case 6:
                    _b.sent();
                    env = __assign(__assign({}, process.env), { PATH: "".concat(binDir, ":").concat((_a = process.env.PATH) !== null && _a !== void 0 ? _a : ""), DOCKER_STUB_LOG: logPath, OPENCLAW_GATEWAY_TOKEN: "test-token", OPENCLAW_CONFIG_DIR: (0, node_path_1.join)(rootDir, "config"), OPENCLAW_WORKSPACE_DIR: (0, node_path_1.join)(rootDir, "openclaw") });
                    delete env.OPENCLAW_DOCKER_APT_PACKAGES;
                    delete env.OPENCLAW_EXTRA_MOUNTS;
                    delete env.OPENCLAW_HOME_VOLUME;
                    result = (0, node_child_process_1.spawnSync)("bash", [scriptPath], {
                        cwd: rootDir,
                        env: env,
                        encoding: "utf8",
                    });
                    (0, vitest_1.expect)(result.status).toBe(0);
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(rootDir, ".env"), "utf8")];
                case 7:
                    envFile = _b.sent();
                    (0, vitest_1.expect)(envFile).toContain("OPENCLAW_DOCKER_APT_PACKAGES=");
                    (0, vitest_1.expect)(envFile).toContain("OPENCLAW_EXTRA_MOUNTS=");
                    (0, vitest_1.expect)(envFile).toContain("OPENCLAW_HOME_VOLUME=");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("plumbs OPENCLAW_DOCKER_APT_PACKAGES into .env and docker build args", function () { return __awaiter(void 0, void 0, void 0, function () {
        var assocCheck, rootDir, scriptPath, dockerfilePath, composePath, binDir, logPath, script, env, result, envFile, log;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    assocCheck = (0, node_child_process_1.spawnSync)("bash", ["-c", "declare -A _t=()"], {
                        encoding: "utf8",
                    });
                    if (assocCheck.status !== 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), "openclaw-docker-setup-"))];
                case 1:
                    rootDir = _b.sent();
                    scriptPath = (0, node_path_1.join)(rootDir, "docker-setup.sh");
                    dockerfilePath = (0, node_path_1.join)(rootDir, "Dockerfile");
                    composePath = (0, node_path_1.join)(rootDir, "docker-compose.yml");
                    binDir = (0, node_path_1.join)(rootDir, "bin");
                    logPath = (0, node_path_1.join)(rootDir, "docker-stub.log");
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repoRoot, "docker-setup.sh"), "utf8")];
                case 2:
                    script = _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(scriptPath, script, { mode: 493 })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(dockerfilePath, "FROM scratch\n")];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(composePath, "services:\n  openclaw-gateway:\n    image: noop\n  openclaw-cli:\n    image: noop\n")];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, writeDockerStub(binDir, logPath)];
                case 6:
                    _b.sent();
                    env = __assign(__assign({}, process.env), { PATH: "".concat(binDir, ":").concat((_a = process.env.PATH) !== null && _a !== void 0 ? _a : ""), DOCKER_STUB_LOG: logPath, OPENCLAW_DOCKER_APT_PACKAGES: "ffmpeg build-essential", OPENCLAW_GATEWAY_TOKEN: "test-token", OPENCLAW_CONFIG_DIR: (0, node_path_1.join)(rootDir, "config"), OPENCLAW_WORKSPACE_DIR: (0, node_path_1.join)(rootDir, "openclaw"), OPENCLAW_EXTRA_MOUNTS: "", OPENCLAW_HOME_VOLUME: "" });
                    result = (0, node_child_process_1.spawnSync)("bash", [scriptPath], {
                        cwd: rootDir,
                        env: env,
                        encoding: "utf8",
                    });
                    (0, vitest_1.expect)(result.status).toBe(0);
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(rootDir, ".env"), "utf8")];
                case 7:
                    envFile = _b.sent();
                    (0, vitest_1.expect)(envFile).toContain("OPENCLAW_DOCKER_APT_PACKAGES=ffmpeg build-essential");
                    return [4 /*yield*/, (0, promises_1.readFile)(logPath, "utf8")];
                case 8:
                    log = _b.sent();
                    (0, vitest_1.expect)(log).toContain("--build-arg OPENCLAW_DOCKER_APT_PACKAGES=ffmpeg build-essential");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps docker-compose gateway command in sync", function () { return __awaiter(void 0, void 0, void 0, function () {
        var compose;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repoRoot, "docker-compose.yml"), "utf8")];
                case 1:
                    compose = _a.sent();
                    (0, vitest_1.expect)(compose).not.toContain("gateway-daemon");
                    (0, vitest_1.expect)(compose).toContain('"gateway"');
                    return [2 /*return*/];
            }
        });
    }); });
});
